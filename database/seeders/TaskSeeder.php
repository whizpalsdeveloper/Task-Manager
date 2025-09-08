<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Task;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      
      // Create 10 tasks for user_id = 1
      Task::factory()->count(10)->create([
            'user_id' => 1
        ]);
    }
}
