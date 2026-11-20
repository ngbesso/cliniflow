<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            ['name' => 'Julie Infirmière', 'email' => 'infirmiere@cliniflow.test', 'role' => Role::Nurse],
            ['name' => 'Dr Tremblay', 'email' => 'medecin@cliniflow.test', 'role' => Role::Doctor],
            ['name' => 'Marc Admin', 'email' => 'admin@cliniflow.test', 'role' => Role::Admin],
        ];
        foreach ($accounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'role' => $account['role'],
                    'password' => 'password',
                    'is_active' => true,
                ],
            );
        }
    }
}
