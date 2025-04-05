<?php
if (extension_loaded('pgsql')) {
    echo "PostgreSQL extension is enabled.";
} else {
    echo "PostgreSQL extension is not enabled.";
}
?>
