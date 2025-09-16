<?php

namespace App\Http\Controllers;

use App\Models\ToDoList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ToDoListController extends Controller
{
    public function index()
    {
        $todos = ToDoList::where('user_id', Auth::id())->get();
        return response()->json($todos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
        ]);
        $todo = ToDoList::create([
            'user_id' => Auth::id(),
            'username' => Auth::user()->name,
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
        ]);
        return response()->json($todo, 201);
    }

    public function show($id)
    {
        $todo = ToDoList::where('user_id', Auth::id())->findOrFail($id);
        return response()->json($todo);
    }

    public function update(Request $request, $id)
    {
        $todo = ToDoList::where('user_id', Auth::id())->findOrFail($id);
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'is_done' => 'sometimes|boolean',
        ]);
        $todo->update($request->only(['title', 'description', 'deadline', 'is_done']));
        return response()->json($todo);
    }

    public function destroy($id)
    {
        $todo = ToDoList::where('user_id', Auth::id())->findOrFail($id);
        $todo->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
