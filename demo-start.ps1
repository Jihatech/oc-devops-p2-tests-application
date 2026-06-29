# =============================================================================
#  EtuBibliotheque - Lancement de la demo (Docker + Back Spring Boot + Front Angular)
#  Lance les services dans le bon ordre, attend qu'ils soient prets, ouvre le navigateur.
#  Usage : double-clic sur demo-start.bat  (ou clic droit sur ce .ps1 > Executer avec PowerShell)
# =============================================================================

$ErrorActionPreference = 'Stop'
$root  = $PSScriptRoot
$back  = Join-Path $root 'back'
$front = Join-Path $root 'front'

function Test-Url($url) {
    try { (Invoke-WebRequest $url -TimeoutSec 5 -UseBasicParsing).StatusCode -ge 200 } catch { $false }
}
function Test-Docker {
    try { docker info *> $null; return ($LASTEXITCODE -eq 0) } catch { return $false }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   EtuBibliotheque - Demarrage de la demo" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# --- PATH / JAVA_HOME (au cas ou) ---
$jdk = [Environment]::GetEnvironmentVariable('JAVA_HOME','User')
if ($jdk) { $env:JAVA_HOME = $jdk }
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')

# --- 1) Docker Desktop ---
Write-Host "`n[1/4] Verification de Docker..." -ForegroundColor Yellow
if (Test-Docker) {
    Write-Host "      Docker est deja demarre." -ForegroundColor Green
} else {
    Write-Host "      Docker n'est pas pret -> lancement de Docker Desktop..."
    $dockerExe = "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerExe) { Start-Process $dockerExe }
    $deadline = (Get-Date).AddMinutes(4)
    while (-not (Test-Docker)) {
        if ((Get-Date) -gt $deadline) { Write-Host "      ERREUR : Docker n'a pas demarre a temps." -ForegroundColor Red; Read-Host "Entree pour quitter"; exit 1 }
        Start-Sleep -Seconds 5
        Write-Host "      ... attente du moteur Docker"
    }
    Write-Host "      Docker pret." -ForegroundColor Green
}

# --- 2) Back-end Spring Boot (port 8080) ---
Write-Host "`n[2/4] Back-end (http://localhost:8080)..." -ForegroundColor Yellow
if (Test-Url "http://localhost:8080/actuator/health") {
    Write-Host "      Back-end deja en ligne." -ForegroundColor Green
} else {
    Write-Host "      Lancement du back-end dans une nouvelle fenetre (MySQL demarre automatiquement)..."
    $backCmd = "`$env:JAVA_HOME='$jdk'; Set-Location '$back'; Write-Host 'BACK-END EtuBibliotheque - ne pas fermer pendant la demo' -ForegroundColor Cyan; .\mvnw.cmd spring-boot:run"
    Start-Process powershell -ArgumentList '-NoExit','-NoProfile','-Command',$backCmd
    Write-Host "      Attente du demarrage (premier lancement = un peu plus long)..."
    $deadline = (Get-Date).AddMinutes(5)
    while (-not (Test-Url "http://localhost:8080/actuator/health")) {
        if ((Get-Date) -gt $deadline) { Write-Host "      ERREUR : le back-end n'a pas demarre a temps (voir sa fenetre)." -ForegroundColor Red; Read-Host "Entree pour quitter"; exit 1 }
        Start-Sleep -Seconds 5
        Write-Host "      ... attente de l'API"
    }
    Write-Host "      Back-end pret (API 8080)." -ForegroundColor Green
}

# --- 3) Front-end Angular (port 4200) ---
Write-Host "`n[3/4] Front-end (http://localhost:4200)..." -ForegroundColor Yellow
if (Test-Url "http://localhost:4200") {
    Write-Host "      Front deja en ligne." -ForegroundColor Green
} else {
    Write-Host "      Lancement du front dans une nouvelle fenetre..."
    $frontCmd = "Set-Location '$front'; Write-Host 'FRONT-END EtuBibliotheque - ne pas fermer pendant la demo' -ForegroundColor Cyan; npm start"
    Start-Process powershell -ArgumentList '-NoExit','-NoProfile','-Command',$frontCmd
    Write-Host "      Attente de la compilation Angular..."
    $deadline = (Get-Date).AddMinutes(3)
    while (-not (Test-Url "http://localhost:4200")) {
        if ((Get-Date) -gt $deadline) { Write-Host "      ERREUR : le front n'a pas demarre a temps (voir sa fenetre)." -ForegroundColor Red; Read-Host "Entree pour quitter"; exit 1 }
        Start-Sleep -Seconds 5
        Write-Host "      ... attente du front"
    }
    Write-Host "      Front pret (4200)." -ForegroundColor Green
}

# --- 4) Ouverture du navigateur ---
Write-Host "`n[4/4] Ouverture du navigateur..." -ForegroundColor Yellow
Start-Process "http://localhost:4200"

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "   Tout est pret pour la demo !" -ForegroundColor Green
Write-Host "   - Application : http://localhost:4200" -ForegroundColor Green
Write-Host "   - 1er passage : cree un compte sur /register (remplir TOUS les champs)" -ForegroundColor Green
Write-Host "   - Puis connecte-toi sur /login" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "`n(Les 2 fenetres back/front doivent rester ouvertes. Ferme-les pour arreter.)"
Read-Host "`nAppuie sur Entree pour fermer cette fenetre de lancement"
