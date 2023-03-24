# Backup storage directory 
backupfolder=/var/backups
# Notification email address 
# recipient_email=<username@mail.com>
# MySQL user
user=ubuntu
# MySQL password
password=12345
# Number of days to store the backup 
keep_day=30 
sqlfile=$backupfolder/kaspi-database-$(date +%d-%m-%Y_%H-%M-%S).sql
zipfile=$backupfolder/kaspi-database-$(date +%d-%m-%Y_%H-%M-%S).zip 
# Create a backup 
mysqldump -u $user -p$password --column-statistics=0 --no-tablespaces kaspi > $sqlfile 
if [ $? -eq 0 ]
then
  echo 'Sql dump created' 
else
  echo 'mysqldump return non-zero code'
  exit 
fi 
# Compress backup 
zip $zipfile $sqlfile 
if [ $? -eq 0 ] 
then
  echo 'The backup was successfully compressed' 
else
  echo 'Error compressing backup' 
  exit 
fi 
rm $sqlfile 
#echo $zipfile | mailx -s 'Backup was successfully created' $recipient_email 
# Delete old backups 
find $backupfolder -mtime +$keep_day -delete
