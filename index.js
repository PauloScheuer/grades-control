import express from 'express';
import fs from 'fs';
const app = express();

app.listen(3333);
app.use(express.json());

app.get('/show/:id', (req, res) => {
  try {
    let allGrades = JSON.parse(fs.readFileSync('grades.json'));
    const id = req.params.id;
    const toShow = allGrades.grades.find(grade => {
      return grade.id === Number(id);
    });
    if (toShow !== undefined) {
      res.send(toShow);
    } else {
      throw new Error;
    }
  } catch (err) {
    res.send("Ih não deu")
  }
});

app.post('/create', (req, res) => {

  try {
    let allGrades = JSON.parse(fs.readFileSync('grades.json'));
    const nextId = allGrades.nextId;
    const time = new Date();
    const newGrade = {
      id: nextId,
      ...req.body,
      timestamp: time
    };
    allGrades.nextId++;
    allGrades.grades.push(newGrade);
    fs.writeFileSync('./grades.json', JSON.stringify(allGrades), 'utf8');
    res.send('Cadastrado com sucesso!');
  } catch (err) {
    res.send('Erro no cadastro');
  }
});

app.put('/edit/:id', (req, res) => {
  try {
    let allGrades = JSON.parse(fs.readFileSync('grades.json'));
    const id = req.params.id;
    const toEdit = allGrades.grades.find(grade => {
      return grade.id === Number(id);
    });
    toEdit.student = req.body.student;
    toEdit.subject = req.body.subject;
    toEdit.type = req.body.type;
    toEdit.value = req.body.value;
    const index = allGrades.grades.findIndex(grade => {
      return grade.id === Number(id);
    });
    allGrades.grades[index] = toEdit;
    fs.writeFileSync('./grades.json', JSON.stringify(allGrades), 'utf8');
    res.send("Grade editada!");
  } catch (err) {
    res.send('Erro na edição');
  }
});

app.delete('/delete/:id', (req, res) => {
  try {
    let allGrades = JSON.parse(fs.readFileSync('grades.json'));
    const id = req.params.id;
    const toDelete = allGrades.grades.findIndex(grade => {
      return grade.id === Number(id);
    });
    if (toDelete > 0) {
      allGrades.grades.splice(toDelete, 1);
      fs.writeFileSync('./grades.json', JSON.stringify(allGrades), 'utf8');
      res.send("Grade deletada!");
    } else {
      throw new Error;
    }

  } catch (err) {
    res.send('Erro na exclusão');
  }
});

app.get('/show-grades', (req, res) => {
  try {
    let allGrades = JSON.parse(fs.readFileSync('grades.json'));
    const student = req.query.student;
    const subject = req.query.subject;
    const filteredGrades1 = allGrades.grades.filter(grade => {
      return grade.student === student;
    });
    const filteredGrades2 = filteredGrades1.filter(grade => {
      return grade.subject === subject;
    });

    const totalGrades = filteredGrades2.map(grade => {
      return grade.value;
    });

    const sumGrades = totalGrades.reduce((acc, cur) => {
      return acc + cur;
    });

    res.send("Soma das notas: " + sumGrades);
  } catch (err) {
    res.send("Deu erro");
  }
});

app.get('/show-media', (req, res) => {
  try {
    let allGrades = JSON.parse(fs.readFileSync('grades.json'));
    const subject = req.query.subject;
    const type = req.query.type;

    const filteredGrades1 = allGrades.grades.filter(grade => {
      return grade.subject === subject;
    });
    const filteredGrades2 = filteredGrades1.filter(grade => {
      return grade.type === type;
    });

    const totalGrades = filteredGrades2.map(grade => {
      return grade.value;
    });

    const sumGrades = totalGrades.reduce((acc, cur) => {
      return acc + cur;
    });

    const mediumGrade = sumGrades / totalGrades.length;

    res.send("Média das notas: " + mediumGrade);
  } catch (err) {
    res.send("Deu erro");
  }
});

app.get('/show-better', (req, res) => {
  try {
    let allGrades = JSON.parse(fs.readFileSync('grades.json'));
    const subject = req.query.subject;
    const type = req.query.type;

    const filteredGrades1 = allGrades.grades.filter(grade => {
      return grade.subject === subject;
    });
    const filteredGrades2 = filteredGrades1.filter(grade => {
      return grade.type === type;
    });

    const totalGrades = filteredGrades2.map(grade => {
      return {
        id: grade.id,
        value: grade.value
      }
    });

    totalGrades.sort((a, b) => {
      return b.value - a.value;
    });

    function firstThree(array) {

      const first = totalGrades[0].id;
      const second = totalGrades[1].id;
      const third = totalGrades[2].id;

      return [
        first,
        second,
        third
      ]
    }

    const betterGrades = firstThree(totalGrades);



    res.send(betterGrades);

  } catch (err) {
    res.send("Deu erro");
  }
});