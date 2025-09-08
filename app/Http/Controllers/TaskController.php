<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {
        return Task::where('user_id', Auth::id())->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in-progress,completed',
            'due_date' => 'nullable|date',
        ]);

        $validated['user_id'] = Auth::id();

        return Task::create($validated);
    }

    public function show(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }
        return $task;
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in-progress,completed',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);
        return $task;
    }

    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
