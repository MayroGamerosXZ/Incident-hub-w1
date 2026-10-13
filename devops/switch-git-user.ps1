param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("devops", "backend", "frontend", "db", "qa", "secops")]
    [string]$Role
)

switch ($Role) {
    "devops" {
        git config user.name "Mayro Gameros (DevOps Lead)"
        git config user.email "devops.lead@incidents.local"
        Write-Host "Cambiado a: Mayro Gameros (DevOps Lead)" -ForegroundColor Cyan
    }
    "backend" {
        git config user.name "Carlos Mendoza (Backend Dev)"
        git config user.email "backend.dev@incidents.local"
        Write-Host "Cambiado a: Carlos Mendoza (Backend Dev)" -ForegroundColor Green
    }
    "frontend" {
        git config user.name "Sofia Gomez (Frontend Dev)"
        git config user.email "frontend.dev@incidents.local"
        Write-Host "Cambiado a: Sofia Gomez (Frontend Dev)" -ForegroundColor Magenta
    }
    "db" {
        git config user.name "Diego Ramirez (DB Architect)"
        git config user.email "database.admin@incidents.local"
        Write-Host "Cambiado a: Diego Ramirez (DB Architect)" -ForegroundColor Yellow
    }
    "qa" {
        git config user.name "Laura Torres (QA Tester)"
        git config user.email "qa.tester@incidents.local"
        Write-Host "Cambiado a: Laura Torres (QA Tester)" -ForegroundColor Blue
    }
    "secops" {
        git config user.name "Andres Morales (SecOps Lead)"
        git config user.email "secops.audit@incidents.local"
        Write-Host "Cambiado a: Andres Morales (SecOps Lead)" -ForegroundColor Red
    }
}
