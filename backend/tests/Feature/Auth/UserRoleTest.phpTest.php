<?php

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\DemoUsersSeeder;

it('casts the role to the Role enum', function () {
    $user = User::factory()->doctor()->create();

    expect($user->fresh()->role)->toBe(Role::Doctor);
});

it('creates active accounts by default', function () {
    expect(User::factory()->create()->fresh()->is_active)->toBeTrue();
});

it('seeds one demo account per role', function () {
    $this->seed(DemoUsersSeeder::class);

    expect(User::pluck('role')->all())
        ->toEqualCanonicalizing([Role::Nurse, Role::Doctor, Role::Admin]);
});

it('can run the demo seeder twice without duplicates', function () {
    $this->seed(DemoUsersSeeder::class);
    $this->seed(DemoUsersSeeder::class);

    expect(User::count())->toBe(3);
});
