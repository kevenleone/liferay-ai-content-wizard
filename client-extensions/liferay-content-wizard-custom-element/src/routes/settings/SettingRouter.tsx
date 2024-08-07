import { Route, Routes, HashRouter } from 'react-router-dom';

import SettingForm from './SettingForm';
import Settings from '.';

export default function SettingRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Settings />} index />
        <Route element={<SettingForm />} path='form' />
      </Routes>
    </HashRouter>
  );
}
