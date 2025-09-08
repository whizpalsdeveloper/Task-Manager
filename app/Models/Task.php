<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    // Table name (optional if convention matches)
    protected $table = 'tasks';

    // Mass assignable attributes
    protected $fillable = [
        'user_id',
        'company_id',
        'assigned_to',
        'title',
        'description',
        'status',
        'due_date',
        'notes',
        'priority',
        'completed_at',
    ];

    // Casts
    protected $casts = [
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Relationship: Task belongs to a User (creator)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: Task belongs to a Company
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relationship: Task assigned to a User
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
