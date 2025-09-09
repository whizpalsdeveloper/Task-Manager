<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $tasks = Task::where('company_id', $user->company_id)
            ->with(['user', 'assignedUser'])
            ->paginate(10);
        
        return response()->json($tasks);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $users = User::where('company_id', $user->company_id)
            ->where('role', 'user')
            ->get(['id', 'name', 'email']);
        
        return response()->json(['users' => $users]);
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
            'assigned_to' => 'required|exists:users,id',
            'due_date' => 'nullable|date|after:now',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        $task = Task::create([
            'user_id' => $user->id,
            'company_id' => $user->company_id,
            'assigned_to' => $request->assigned_to,
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'priority' => $request->priority??'medium',
            'status' => 'pending',
        ]);

        // Send email notification to assigned user (commented out for demo)
        // $assignedUser = User::find($request->assigned_to);
        // if ($assignedUser) {
        //     Mail::raw("You have been assigned a new task: {$task->title}", function ($message) use ($assignedUser) {
        //         $message->to($assignedUser->email)
        //             ->subject('New Task Assignment');
        //     });
        // }

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task->load(['user', 'assignedUser'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $user = Auth::user();
        
        // Ensure task belongs to company
        if ($task->company_id !== $user->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->load(['user', 'assignedUser', 'company']);
        return response()->json($task);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $user = Auth::user();
        
        // Ensure task belongs to company
        if ($task->company_id !== $user->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::where('company_id', $user->company_id)
            ->where('role', 'user')
            ->get(['id', 'name', 'email']);
        
        return response()->json([
            'task' => $task,
            'users' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $user = Auth::user();
        
        // Ensure task belongs to company
        if ($task->company_id !== $user->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'required|exists:users,id',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        $task->update($request->only([
            'title', 'description', 'assigned_to', 'due_date', 'priority'
        ]));

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task->load(['user', 'assignedUser'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $user = Auth::user();
        
        // Ensure task belongs to company
        if ($task->company_id !== $user->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    /**
     * Get users for task assignment
     */
    public function users()
    {
        $user = Auth::user();
        $users = User::where('company_id', $user->company_id)
            ->where('role', 'user')
            ->get(['id', 'name', 'email']);
        
        return response()->json($users);
    }
}
