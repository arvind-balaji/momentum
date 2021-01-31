cd dist
git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/arvind-balaji/Momentum.git master:gh-pages
cd ../
