<?php

it('issues a CSRF cookie for the SPA', function () {
    $this->get('/sanctum/csrf-cookie')
        ->assertNoContent()
        ->assertCookie('XSRF-TOKEN');
});

it('rejects unauthenticated access to the current user', function () {
    $this->getJson('/api/user')
        ->assertUnauthorized();
});
