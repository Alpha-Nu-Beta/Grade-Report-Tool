npm i &&
echo "Have you put all the transcripts in '/files?' (y/n)" &&
read answer &&
if [ "$answer" = "y" ]; then
  npm start
else
  echo "Please put all the transcripts in '/files' and try again"
fi