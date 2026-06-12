const fs = require('fs');
const path = require('path');

let f = 'php_export/update.php';
let content = fs.readFileSync(f, 'utf8');
content = content.replace(
  '<form action="update.php?id=<?php echo urlencode($id); ?>" method="POST" class="space-y-8">',
  '<form action="update.php?id=<?php echo urlencode($id); ?>" method="POST" class="space-y-8" enctype="multipart/form-data">'
);
fs.writeFileSync(f, content);
console.log('done fixing update form');
