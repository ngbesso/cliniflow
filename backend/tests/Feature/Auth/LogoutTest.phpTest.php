<?php

use App\Models\User;

beforeEach(function () {
    $this->withHeader('Origin', 'http://localhost:5173');
});

it('logs the user out and ends the session', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/logout')
        ->assertNoContent();

    $this->assertGuest('web');
});

it('refuses to log out a visitor who is not logged in', function () {
    $this->postJson('/api/logout')->assertUnauthorized();
});

it('expires sessions after 15 minutes of inactivity', function () {
    expect(config('session.lifetime'))->toBe(15);
});
