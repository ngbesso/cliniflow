<?php

it('reports the application as healthy', function () {
    $this->getJson('/api/health')
        ->assertOk()
        ->assertExactJson([
            'status' => 'ok',
            'checks' => ['database' => 'ok', 'redis' => 'ok'],
        ]);
});
