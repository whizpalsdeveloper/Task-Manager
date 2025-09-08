<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create sample company
        $company = Company::create([
            'name' => 'Sample Company',
            'email' => 'company@example.com',
            'phone' => '+1234567890',
            'address' => '123 Main St, City, State',
            'website' => 'https://example.com',
            'status' => 'active',
        ]);

        // Create company admin user
        User::create([
            'name' => 'Company Admin',
            'email' => 'company.admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'company',
            'company_id' => $company->id,
        ]);

        // Create sample users for the company
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'company_id' => $company->id,
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'company_id' => $company->id,
        ]);
    }
}
