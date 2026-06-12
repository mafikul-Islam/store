const fs = require('fs');
const path = require('path');

const dir = 'php_export';
['add.php', 'update.php'].forEach(file => {
    let filepath = path.join(dir, file);
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Change form to support file uploads
    content = content.replace(/<form action="(add|update).php"(.*?)>/, '<form action="$1.php" method="POST" enctype="multipart/form-data" class="space-y-8">');
    // For update.php, the action includes ID `action="update.php?id=..."`
    // Let's be safer:
    content = content.replace(/<form method="POST" class="space-y-8">/g, '<form method="POST" enctype="multipart/form-data" class="space-y-8">');
    content = content.replace(/<form action="add\.php" method="POST" class="space-y-8">/g, '<form action="add.php" method="POST" enctype="multipart/form-data" class="space-y-8">');

    // Make sure update.php has enctype
    if (!content.includes('enctype="multipart/form-data"') && content.match(/<form[^>]+class="space-y-8"[^>]*>/)) {
       content = content.replace(/(<form[^>]+class="space-y-8"[^>]*)>/, '$1 enctype="multipart/form-data">');
    }

    // 2. Add the Image File input below Image URL
    const fileInputHtml = `
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label for="image_file" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Or Upload from Device (Overrides URL)
                        </label>
                        <div class="mt-2 text-gray-900 dark:text-white">
                            <input 
                                type="file" 
                                id="image_file" 
                                name="image_file" 
                                accept="image/*"
                                class="block w-full text-sm text-gray-500 dark:text-gray-400
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-black file:text-white dark:file:bg-white dark:file:text-black
                                  hover:file:bg-gray-800 dark:hover:file:bg-gray-200"
                            >
                        </div>
                    </div>`;

    content = content.replace(/name="image_url"([^>]*>)(\s*)<\/div>/s, 'name="image_url"$1$2</div>$2' + fileInputHtml);

    // 3. Add PHP logic for file upload handling
    // It should be injected before: $image = trim($_POST['image_url']);
    // Oh wait, in add.php it is: $image = trim($_POST['image_url']);
    //                            if (empty($image)) {
    const uploadLogic = `
    $image = trim($_POST['image_url'] ?? '');
    
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $fileName = uniqid() . '_' . basename($_FILES['image_file']['name']);
        $targetFile = $uploadDir . $fileName;
        
        if (move_uploaded_处ile($_FILES['image_file']['tmp_name'], $targetFile)) { // wait, typo: move_uploaded_file
            $image = $targetFile;
        }
    }
    
    // Fallback if empty image url is submitted
    if (empty($image)) {`;

    content = content.replace(/\$image = trim\(\$_POST\['image_url'\]\);\s*\/\/\s*Fallback if empty image url is submitted\s*if \(empty\(\$image\)\) \{/s, uploadLogic.replace('move_uploaded_处ile', 'move_uploaded_file'));

    // In update.php:
    const updateUploadLogic = `
    $image = trim($_POST['image_url'] ?? '');
    
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $fileName = uniqid() . '_' . basename($_FILES['image_file']['name']);
        $targetFile = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['image_file']['tmp_name'], $targetFile)) {
            $image = $targetFile;
        }
    }
    
    if (empty($image)) {`;
    
    content = content.replace(/\$image = trim\(\$_POST\['image_url'\]\);\s*if \(empty\(\$image\)\) \{/s, updateUploadLogic);

    fs.writeFileSync(filepath, content);
});

console.log('done image fix');
