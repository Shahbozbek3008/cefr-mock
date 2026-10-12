const { execFileSync, spawn } = require('child_process');
const path = require('path');

const adb = path.join(process.env.LOCALAPPDATA, 'Android', 'platform-tools', 'adb.exe');

const devices = execFileSync(adb, ['devices'], { encoding: 'utf8' })
  .split('\n')
  .slice(1)
  .map((line) => line.trim())
  .filter(Boolean);

if (devices.length === 0) {
  console.error('Telefon topilmadi. USB kabelni ulang va USB debugging yoqilganini tekshiring.');
  process.exit(1);
}

if (devices.some((line) => line.endsWith('unauthorized'))) {
  console.error('Telefonda "USB debugging ga ruxsat berish" oynasida Allow ni bosing.');
  process.exit(1);
}

execFileSync(adb, ['reverse', 'tcp:8081', 'tcp:8081'], { stdio: 'inherit' });
console.log('USB ulanish tayyor: telefon 8081 -> kompyuter 8081');

spawn('npx', ['expo', 'start', '--dev-client', '--localhost'], {
  stdio: 'inherit',
  shell: true,
});
