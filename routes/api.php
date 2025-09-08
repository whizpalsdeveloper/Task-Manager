<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Company\TaskController as CompanyTaskController;
use App\Http\Controllers\User\TaskController as UserTaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed', // expects password_confirmation field
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'message' => 'User registered successfully',
        'user' => $user,
        'token' => $token,
    ], 201);
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // Delete previous tokens (optional but good practice)
    $user->tokens()->delete();

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'user' => $user,
        'token' => $token,
    ]);
});

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->tokens()->delete();

    return response()->json(['message' => 'Logged out successfully']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// ✅ Admin Routes (protected by auth:sanctum and role:admin)
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::apiResource('companies', CompanyController::class);
    Route::get('companies/{company}/customers', [CompanyController::class, 'customers']);
});

// ✅ Company Routes (protected by auth:sanctum and role:company)
Route::middleware(['auth:sanctum', 'role:company'])->prefix('company')->name('company.')->group(function () {
    Route::apiResource('tasks', CompanyTaskController::class);
    Route::get('users', [CompanyTaskController::class, 'users']);
});

// ✅ User Routes (protected by auth:sanctum and role:user)
Route::middleware(['auth:sanctum', 'role:user'])->prefix('user')->name('user.')->group(function () {
    Route::apiResource('tasks', UserTaskController::class);
    Route::patch('tasks/{task}/status', [UserTaskController::class, 'updateStatus']);
    Route::post('tasks/{task}/notes', [UserTaskController::class, 'addNotes']);
});

// ✅ General Task Routes (protected by auth:sanctum) - for backward compatibility
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
});