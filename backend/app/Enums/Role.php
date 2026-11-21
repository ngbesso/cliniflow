<?php

namespace App\Enums;

enum Role: string
{
    case Nurse = 'nurse';
    case Doctor = 'doctor';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Nurse => 'Infirmière',
            self::Doctor => 'Médecin',
            self::Admin => 'Administrateur',
        };
    }
}
