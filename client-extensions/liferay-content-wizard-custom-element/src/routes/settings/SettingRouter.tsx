import { Route, Routes, HashRouter } from 'react-router-dom';

import Setting from './Setting';
import SettingForm from './SettingForm';
import Settings from '.';
import SettingOutlet from './SettingOutlet';

export default function SettingRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route element={<Settings />} index />
                <Route element={<SettingForm />} path="create" />
                <Route element={<SettingOutlet />} path=":id">
                    <Route element={<Setting />} index />
                    <Route element={<SettingForm />} path="update" />
                </Route>
            </Routes>
        </HashRouter>
    );
}
