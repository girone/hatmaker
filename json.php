<?php

function PHP_to_JSON($rows)
{
    return json_encode($rows, JSON_NUMERIC_CHECK);
}

function JSON_to_PHP($json)
{
    return json_decode($json, $assoc = true);
}

?>