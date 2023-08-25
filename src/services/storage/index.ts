import {StateStorage} from 'zustand/middleware';
// import {MMKV} from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const storage = new MMKV();
const storage = AsyncStorage;

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    // return storage.set(name, value);
    return storage.setItem(name, value);
  },
  getItem: name => {
    // const value = storage.getString(name);
    const value = storage.getItem(name);
    return value ?? null;
  },
  removeItem: name => {
    // return storage.delete(name);
    return storage.removeItem(name);
  },
};

export default zustandStorage;
