const fs = require('fs');

const fAdd = 'php_export/add.php';
let textAdd = fs.readFileSync(fAdd, 'utf8');
textAdd = textAdd.replace(/\$\{imgSrcStr \? '' : 'hidden '\}/g, 'hidden ');
textAdd = textAdd.replace(/src="\$\{imgSrcStr\}"/, 'src=""');
textAdd = textAdd.replace(/\$\{imgSrcStr \? 'hidden ' : ''\}/g, '');
fs.writeFileSync(fAdd, textAdd);

const fUpd = 'php_export/update.php';
let textUpd = fs.readFileSync(fUpd, 'utf8');
// In update.php we had imgSrcStr as php echo. So it should show the image if it exists.
let imgEcho = '<?php echo htmlspecialchars($product["image"]); ?>';
textUpd = textUpd.replace(/\$\{imgSrcStr \? '' : 'hidden '\}/g, '');
textUpd = textUpd.replace(/src="\$\{imgSrcStr\}"/, 'src="' + imgEcho + '"');
textUpd = textUpd.replace(/\class="\$\{imgSrcStr \? 'hidden ' : ''\}"/, 'class="hidden"');
textUpd = textUpd.replace(/\$\{imgSrcStr \? 'hidden ' : ''\}/g, 'hidden');
fs.writeFileSync(fUpd, textUpd);

console.log('Fixed imgSrcStr bugs');
