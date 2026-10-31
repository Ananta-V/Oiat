const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(l => {
  const idx = l.indexOf('=');
  if (idx > 0) {
    const k = l.substring(0, idx).trim();
    const v = l.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    envVars[k] = v;
  }
});
const { createClient } = require('@supabase/supabase-js');
const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function test() {
  const p = await supabase.from('products').select('count', { count: 'exact', head: true });
  console.log('PRODUCTS_TABLE:', p.error ? p.error.message : 'OK, count: ' + p.count);
  const o = await supabase.from('orders').select('count', { count: 'exact', head: true });
  console.log('ORDERS_TABLE:', o.error ? o.error.message : 'OK, count: ' + o.count);
  const f = await supabase.from('feedback').select('count', { count: 'exact', head: true });
  console.log('FEEDBACK_TABLE:', f.error ? f.error.message : 'OK, count: ' + f.count);
}
test();

