$env:CONFIGURE_SCRIPT="configure.py"

npm install --global node-gyp@9.4.0
npm prefix -g | % {npm config set node_gyp "$_\node_modules\node-gyp\bin\node-gyp.js"}
yarn

python ./$env:CONFIGURE_SCRIPT