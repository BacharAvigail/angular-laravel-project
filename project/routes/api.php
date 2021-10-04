
<?php

use App\Http\Controllers\Api\ArticlesController;
use Illuminate\Support\Facades\Route;
use Orion\Facades\Orion;

Route::group(['as' => 'api.'], function() {
    Orion::resource('articles', ArticlesController::class);
});