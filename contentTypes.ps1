Function SetContentType
{
    param(
        [Microsoft.WindowsAzure.Commands.Common.Storage.ResourceModel.AzureStorageBlob] $Blob, 
        [string] $ContentType
    )

    $CloudBlockBlob = [Microsoft.Azure.Storage.Blob.CloudBlockBlob] $Blob.ICloudBlob

    $CloudBlockBlob.Properties.ContentType = $ContentType
    $task = $CloudBlockBlob.SetPropertiesAsync()
    $task.Wait()
    
    Write-Host $task.Status
}

Write-Host "Jiihaa!"
Write-Host "$Env:PORTAL_STORAGE_KEY"
Write-Host "$Env:PORTAL_STORAGE_ACCOUNT"
Write-Host "$STORAGE_KEY"
Write-Host "$Env:SP_BACKEND_CLIENT_ID"
Write-Host "$Env:storageAccount"
Write-Host "$Env:storageAccountKey"
Write-Host "Loppu"

$context = New-AzStorageContext -StorageAccountName $Env:PORTAL_STORAGE_ACCOUNT -StorageAccountKey $Env:PORTAL_STORAGE_KEY

Write-Host "Enabling static web site hosting on the storage account"

Enable-AzStorageStaticWebsite -Context $context -IndexDocument "index.html" -ErrorDocument404Path "index.html"

Write-Host "Succesfully enabled static web site hosting on the storage account"

$Blobs = Get-AzStorageBlob -Context $Context -Container '$web'

foreach ($Blob in $Blobs) {
	Write-Host "Processing Blob:" $Blob.Name

	$Extn = [IO.Path]::GetExtension($Blob.Name)
	$ContentType = ""

	switch ($Extn) {
		".css" { $ContentType = "text/css" }
		".html" { $ContentType = "text/html" }		
		Default { $ContentType = "" }
	}

	Write-Host "Blob file extension is" $Extn "- this will change the content type to" $ContentType

	if ($ContentType -ne "") {
		SetContentType $Blob $ContentType
	}      
}

Write-Host "Completed Processing Container"