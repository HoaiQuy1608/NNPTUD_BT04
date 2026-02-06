var express = require('express');
var router = express.Router();
var categories = require('../utils/data');
var products = require('../utils/products');

router.get('/', function(req, res, next) {
  const { name } = req.query;
  if (name) {
    const filtered = categories.filter(c => 
      c.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(filtered); 
  }
  res.json(categories);
});

router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  const item = categories.find(c => c.id === id);
  if (!item) {
    return res.status(404).json({ message: "Không tìm thấy ID" });
  }
  res.json(item);
});

router.get('/slug/:slug', function(req, res, next) {
  const slug = req.params.slug;
  const item = categories.find(c => c.slug === slug);
  if (!item) {
    return res.status(404).json({ message: "Không tìm thấy Slug" });
  }
  res.json(item);
});

router.post('/', function(req, res, next) {
  const { name, image } = req.body;
  const maxId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) : 0;
  const newId = maxId + 1;
  const newSlug = name ? name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : '';
  const newItem = {
    id: newId,
    name: name,
    slug: newSlug,
    image: image || "",
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  categories.push(newItem);
  res.status(201).json(newItem);
});

router.put('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Không tìm thấy để sửa" });
  }
  const { name, image } = req.body;
  if (name) {
    categories[index].name = name;
    categories[index].slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
  if (image) categories[index].image = image;
  categories[index].updatedAt = new Date().toISOString();
  res.json(categories[index]);
});

router.delete('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Không tìm thấy để xóa" });
  }
  const deletedItem = categories.splice(index, 1);
  res.json({ message: "Đã xóa thành công", deletedItem: deletedItem[0] });
});

router.get('/:id/products', function(req, res, next) {
  const catId = parseInt(req.params.id);
  const result = products.filter(p => p.categoryId === catId);
  res.json(result);
});

module.exports = router;