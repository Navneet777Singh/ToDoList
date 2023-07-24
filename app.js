const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://navneetsinggh001:Test123@cluster0.l39ynun.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welocome to todo List",
});

const item2 = new Item({
  name: "Hit the + button to add a new item",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Item.find({})

    .then(function (foundItems) {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(function () {
            console.log("Successfully saved into our DB.");
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        res.render("list", { listTitle: "Today", newListItem: foundItems });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.get("/:customName", function (req, res) {
  const customName = req.params.customName;

  List.findOne({ name: customName })
    .then((foundList) => {
      if (!foundList) {
        const list = new List({
          name: customName,
          items: defaultItems,
        });
        list.save();
      }
      res.render("list", {
        listTitle: foundList.name,
        newListItem: foundList.items,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/delete", function (req, res) {
  const checkMyID = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === 'Today'){
    Item.findByIdAndRemove(checkMyID)
    .then(function () {
      console.log("Removed Succesfully from " + listName + " list");
      res.redirect("/");
    })
    .catch(function (err) {
      console.log(err);
    });
  }else{
    List.findOneAndUpdate({name : listName},{$pull : {items : {_id : checkMyID}}})
    .then(function () {
      console.log("Removed Succesfully...");
      res.redirect("/" + listName);
    })
    .catch(function (err) {
      console.log(err);
    });

  }
  
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/work", function (req, res) {
  const item = req.body.newItem;
  workListItem.push(item);
  res.redirect("/work");
});

app.listen(3000, function () {
  console.log("Server is started on port 3000...");
});
