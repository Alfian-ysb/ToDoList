<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToDoList extends Model
{
    //
    protected $fillable = [
        'user_id',
        'username',
        'title',
        'description',
        'deadline',
        'is_done',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
