<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $tasks = Task::where('assigned_to', $user->id)
            ->with(['user', 'company'])
            ->paginate(10);
        
        return response()->json($tasks);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(['message' => 'Create form']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date|after:now',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        $task = Task::create([
            'user_id' => $user->id,
            'company_id' => $user->company_id,
            'assigned_to' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'priority' => $request->priority??'medium',
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task->load(['user', 'company'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $user = Auth::user();
        
        // Ensure task is assigned to user
        if ($task->assigned_to !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->load(['user', 'company']);
        return response()->json($task);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $user = Auth::user();
        
        // Ensure task is assigned to user
        if ($task->assigned_to !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['task' => $task]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $user = Auth::user();
        
        // Ensure task is assigned to user
        if ($task->assigned_to !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|in:low,medium,high',
            'status' => 'required|in:pending,in-progress,completed',
            'notes' => 'nullable|string',
        ]);

        $updateData = $request->only([
            'title', 'description', 'due_date', 'priority', 'status', 'notes'
        ]);

        // Set completed_at if status is completed
        if ($request->status === 'completed' && $task->status !== 'completed') {
            $updateData['completed_at'] = now();
        }

        $task->update($updateData);

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task->load(['user', 'company'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $user = Auth::user();
        
        // Ensure task is assigned to user
        if ($task->assigned_to !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    /**
     * Update task status only
     */
    public function updateStatus(Request $request, Task $task)
    {
        $user = Auth::user();
        
        // Ensure task is assigned to user
        if ($task->assigned_to !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,in-progress,completed',
        ]);

        $updateData = ['status' => $request->status];

        // Set completed_at if status is completed
        if ($request->status === 'completed' && $task->status !== 'completed') {
            $updateData['completed_at'] = now();
        }

        $task->update($updateData);

        return response()->json([
            'message' => 'Task status updated successfully',
            'task' => $task->load(['user', 'company'])
        ]);
    }

    /**
     * Add notes to task
     */
    public function addNotes(Request $request, Task $task)
    {
        $user = Auth::user();
        
        // Ensure task is assigned to user
        if ($task->assigned_to !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'notes' => 'required|string',
        ]);

        $task->update(['notes' => $request->notes]);

        return response()->json([
            'message' => 'Notes added successfully',
            'task' => $task->load(['user', 'company'])
        ]);
    }
}
