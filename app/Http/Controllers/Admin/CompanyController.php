<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $companies = Company::with('users')->paginate(10);
        return response()->json($companies);
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:companies,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'website' => 'nullable|url',
            'logo' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|unique:users,email',
            'admin_password' => 'required|string|min:8',
        ]);

        $company = Company::create($request->only([
            'name', 'email', 'phone', 'address', 'website', 'logo', 'status'
        ]));

        // Create company admin user
        User::create([
            'name' => $request->admin_name,
            'email' => $request->admin_email,
            'password' => Hash::make($request->admin_password),
            'role' => 'company',
            'company_id' => $company->id,
        ]);

        return response()->json([
            'message' => 'Company created successfully',
            'company' => $company->load('users')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        $company->load(['users', 'tasks']);
        return response()->json($company);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        return response()->json(['company' => $company]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('companies')->ignore($company->id)],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'website' => 'nullable|url',
            'logo' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $company->update($request->only([
            'name', 'email', 'phone', 'address', 'website', 'logo', 'status'
        ]));

        return response()->json([
            'message' => 'Company updated successfully',
            'company' => $company
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        $company->delete();
        return response()->json(['message' => 'Company deleted successfully']);
    }

    /**
     * Get customers (users) of a specific company
     */
    public function customers(Company $company)
    {
        $customers = $company->users()->where('role', 'user')->paginate(10);
        return response()->json($customers);
    }
}
