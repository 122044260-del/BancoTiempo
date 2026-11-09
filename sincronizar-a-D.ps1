# Sincroniza la copia escribible con D:\BancoTiempo\BancoTiempo
# IMPORTANTE: ejecutar en PowerShell COMO ADMINISTRADOR.

$ErrorActionPreference = 'Stop'
$origen  = 'C:\Users\cross\BancoTiempo'
$destino = 'D:\BancoTiempo\BancoTiempo'
$yo = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

Write-Host "1) Dando permisos de escritura a $yo ..." -ForegroundColor Cyan
icacls 'D:\BancoTiempo' /grant "${yo}:(OI)(CI)M" /T | Out-Null

Write-Host '2) Copiando archivos del proyecto...' -ForegroundColor Cyan
robocopy $origen $destino /E /XD node_modules .expo dist /XF sincronizar-a-D.ps1 /NFL /NDL /NJH /NJS
$codigo = $LASTEXITCODE

if ($codigo -ge 8) {
  Write-Host "La copia falló (código robocopy $codigo)." -ForegroundColor Red
  pause
  exit 1
}

# Pantallas antiguas que fueron reemplazadas por CategoriasScreen y UsuarioFormScreen
Remove-Item "$destino\src\src\screens\admin\CatalogoCategoriasScreen.js" -Force -ErrorAction SilentlyContinue
Remove-Item "$destino\src\src\screens\admin\CrearUsuarioScreen.js" -Force -ErrorAction SilentlyContinue

Write-Host ''
Write-Host 'Listo. Proyecto actualizado en D:\BancoTiempo\BancoTiempo' -ForegroundColor Green
Write-Host 'Para ejecutarlo ahí:' -ForegroundColor Green
Write-Host '  cd D:\BancoTiempo\BancoTiempo'
Write-Host '  npm install'
Write-Host '  npm start'
Write-Host ''
pause
