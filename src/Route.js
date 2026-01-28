import Config from "./Config.js";
import mysql from "mysql";

const config = Config();

export class Route {
  constructor(app, upload) {
    this.app = app;
    this.upload = upload;
    this.handleDisconnect();
  }

  handleDisconnect() {
    this.connection = mysql.createConnection(config);
    console.log("db connection is success. ");
    /*
    this.connection.connect((err) => {
      if (err) {
        console.log("error when connecting to db : " + err);

        setTimeout(() => {
          this.handleDisconnect();
        }, 2000);
      }
      console.log("db connection is success. ");
    });*/

    this.connection.on("error", (err) => {
      console.log("db error : " + err);
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        return this.handleDisconnect();
      } else {
        throw err;
      }
    });
  }

  route() {
    const app = this.app;
    const upload = this.upload;

    app.get("/", function (req, res) {
      res.render("index.html", {});
    });

    app.post("/update/user-score", (req, res) => {
      const id = req.body.id;
      const score = req.body.score;
      const line = req.body.line;
      console.log("/update/user-score ? " + id + " / " + score + " / " + line);
      const qry = `update user set score=${score}, line=${line} where id='${id}'`;
      this.connection.query(qry, (err, row) => {
        if (err) {
          res.send("fail");
          return;
        }
        res.send("success");
      });
    });

    app.post("/fetch/users-ranking", (req, res) => {
      const qry = `select * from user order by score DESC`;
      console.log("/fetch/users");
      this.connection.query(qry, (err, row) => {
        if (err) {
          res.send(null);
          return;
        }
        res.send(row);
      });
    });

    app.post("/fetch/users", (req, res) => {
      const qry = `select * from user`;
      console.log("/fetch/users");
      this.connection.query(qry, (err, row) => {
        if (err) {
          res.send("fail");
          return;
        }
        res.send(row);
      });
    });

    app.post("/update/user", (req, res) => {
      const id = req.body.id;
      const name = req.body.name;
      const email = req.body.email;
      console.log("/update/user");
      const qry = `update user set name='${name}', email='${email}' where id='${id}'`;
      this.connection.query(qry, (err, row) => {
        if (err) {
          res.send("fail");
          return;
        }
        res.send("success");
      });
    });

    app.post("/login", (req, res) => {
      const id = req.body.id;
      const name = req.body.name;
      const email = req.body.email;

      console.log("/login ? " + id + " / " + name + " / " + email);
      this.connection.query(
        `INSERT INTO user VALUES('${id}', '${name}', '${email}', 0, 0, now(), now()) ON DUPLICATE KEY UPDATE name='${name}', updated=now()`,
        (err, row) => {
          if (err) throw err;
          res.send("success");
        },
      );
    });

    app.post("/user/delete", (req, res) => {
      const id = req.body.id;
      console.log("user delete " + id);

      this.connection.query(
        `DELETE FROM user WHERE id = '${id}'`,
        (err, row) => {
          if (err) throw err;
          res.send("success");
        },
      );
    });

    app.post("/user/create", (req, res) => {
      const id = req.body.id;
      const name = req.body.name;
      const email = req.body.email;
      const score = req.body.score;
      const line = req.body.line;
      console.log("user create " + id + " / " + name + " / " + email);
      this.connection.query(
        `INSERT INTO user VALUES('${id}','${name}','${email}', ${score}, ${line} , now(), now())`,
        (err, row) => {
          if (err) throw err;
          res.send("success");
        },
      );
    });

    app.post("/user/update", (req, res) => {
      const id = req.body.id;
      const name = req.body.name;
      const email = req.body.email;
      const score = req.body.score;
      const line = req.body.line;
      console.log(
        "user update " + id + " / name " + name + " / email " + email,
      );
      this.connection.query(
        `UPDATE user SET name='${name}',email='${email}',score=${score}, line=${line} WHERE id = '${id}'`,
        (err, row) => {
          if (err) throw err;
          res.send("success");
        },
      );
    });

    app.post("/user", (req, res) => {
      this.connection.query(
        `SELECT * FROM user ORDER BY created DESC`,
        (err, row) => {
          if (err) throw err;
          res.json(row);
        },
      );
    });

    app.post("/user-by-id", (req, res) => {
      const id = req.body.id;
      this.connection.query(
        `SELECT * FROM user WHERE id = '${id}'`,
        (err, row) => {
          if (err) throw err;
          if (row.length > 0) {
            res.json(row[0]);
          } else {
            res.send(null);
          }
        },
      );
    });

    //1. enetry point
    app.listen(1127, function () {
      console.log("DJK SERVER listen on *:1127");
    });
  }
}
