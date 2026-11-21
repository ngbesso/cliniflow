<?php

use App\Models\User;
use Illuminate\Testing\TestResponse;

beforeEach(function () {
    $this->withHeader('Origin', 'http://localhost:5173');
});

function attemptLogin(string $email, string $password): TestResponse
{
    return test()->postJson('/api/login', ['email' => $email, 'password' => $password]);
}

it('logs in an active user with valid credentials', function () {
    $user = User::factory()->create(['email' => 'julie@cliniflow.test']);

    attemptLogin('julie@cliniflow.test', 'password')
        ->assertOk()
        ->assertExactJson([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => 'julie@cliniflow.test',
                'role' => 'nurse',
                'roleLabel' => 'Infirmière',
            ],
        ]);

    $this->assertAuthenticatedAs($user);
});

it('rejects a wrong password with a generic message', function () {
    User::factory()->create(['email' => 'julie@cliniflow.test']);

    attemptLogin('julie@cliniflow.test', 'faux')
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email' => 'Identifiants invalides.']);

    $this->assertGuest();
});

it('gives the same message for an unknown email', function () {
    attemptLogin('inconnu@cliniflow.test', 'password')
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email' => 'Identifiants invalides.']);
});

it('refuses a deactivated account even with the right password', function () {
    User::factory()->inactive()->create(['email' => 'julie@cliniflow.test']);

    attemptLogin('julie@cliniflow.test', 'password')
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email' => 'Identifiants invalides.']);

    $this->assertGuest();
});

it('blocks the sixth attempt after five failures, even with the right password', function () {
    User::factory()->create(['email' => 'julie@cliniflow.test']);

    foreach (range(1, 5) as $attempt) {
        attemptLogin('julie@cliniflow.test', 'faux')->assertUnprocessable();
    }

    attemptLogin('julie@cliniflow.test', 'password')
        ->assertTooManyRequests()
        ->assertJsonPath('message', fn (string $message) => str_starts_with($message, 'Trop de tentatives.'));

    $this->assertGuest();
});

it('resets the failure counter after a successful login', function () {
    User::factory()->create(['email' => 'julie@cliniflow.test']);

    foreach (range(1, 4) as $attempt) {
        attemptLogin('julie@cliniflow.test', 'faux')->assertUnprocessable();
    }

    attemptLogin('julie@cliniflow.test', 'password')->assertOk();

    foreach (range(1, 4) as $attempt) {
        attemptLogin('julie@cliniflow.test', 'faux')->assertUnprocessable();
    }
});

it('validates the required fields', function () {
    test()->postJson('/api/login', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});

it('returns the authenticated user on /api/user', function () {
    $user = User::factory()->doctor()->create();

    $this->actingAs($user)
        ->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('data.role', 'doctor')
        ->assertJsonPath('data.roleLabel', 'Médecin');
});
