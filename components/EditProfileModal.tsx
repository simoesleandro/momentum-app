import React, { useState, useRef, useEffect } from 'react';
import { useUserData } from '../hooks/useUserData';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../styles/themes';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { data, updateProfile, updateProfilePicture } = useUserData();
  
  const [userName, setUserName] = useState(data.userName);
  const [userNameError, setUserNameError] = useState('');
  const [height, setHeight] = useState(data.height.toString());
  const [heightError, setHeightError] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState(data.profilePictureUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUserName(data.userName);
      setHeight(data.height.toString());
      setProfilePictureUrl(data.profilePictureUrl);
      setUserNameError('');
      setHeightError('');
    }
  }, [isOpen, data]);


  if (!isOpen) return null;

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIMENSION = 256;
          let { width, height } = img;

          if (width > height) {
            if (width > MAX_DIMENSION) {
              height *= MAX_DIMENSION / width;
              width = MAX_DIMENSION;
            }
          } else {
            if (height > MAX_DIMENSION) {
              width *= MAX_DIMENSION / height;
              height = MAX_DIMENSION;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL(file.type, 0.95);
          setProfilePictureUrl(dataUrl);
        };
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);
    if (!value.trim()) {
        setUserNameError('O nome não pode estar em branco.');
    } else {
        setUserNameError('');
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHeight(value);
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0.5 || numValue > 2.5) { // Reasonable height range
        setHeightError('Altura inválida (ex: 1.67).');
    } else {
        setHeightError('');
    }
  };

  const handleSave = () => {
    // Trigger final validation
    handleUserNameChange({ target: { value: userName } } as any);
    handleHeightChange({ target: { value: height } } as any);

    const isNameValid = userName.trim() !== '';
    const heightValue = parseFloat(height);
    const isHeightValid = !isNaN(heightValue) && heightValue > 0.5 && heightValue < 2.5;

    if (!isNameValid || !isHeightValid) {
        return;
    }

    if (profilePictureUrl !== data.profilePictureUrl) {
      updateProfilePicture(profilePictureUrl);
    }

    updateProfile({ userName: userName.trim(), height: heightValue });
    onClose();
  };
  
  const hasErrors = !!userNameError || !!heightError;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-brand-surface dark:bg-brand-surface-dark rounded-xl shadow-lg p-6 w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-brand-text dark:text-brand-text-dark mb-6 text-center">Editar Perfil</h2>
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={profilePictureUrl}
              alt="Foto de Perfil"
              className="w-24 h-24 rounded-full border-4 border-brand-primary object-cover shadow-lg"
            />
            <button
              onClick={handlePictureClick}
              className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Alterar foto de perfil"
            >
              <i className="fas fa-camera text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-brand-subtle dark:text-brand-subtle-dark mb-1">Nome</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={handleUserNameChange}
              className={`w-full bg-brand-background dark:bg-brand-background-dark border p-3 rounded-md focus:outline-none focus:ring-2 ${userNameError ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-primary'}`}
              aria-invalid={!!userNameError}
              aria-describedby="username-error"
            />
            {userNameError && <p id="username-error" className="text-red-500 text-xs mt-1">{userNameError}</p>}
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-brand-subtle dark:text-brand-subtle-dark mb-1">Altura (m)</label>
            <input
              type="number"
              id="height"
              step="0.01"
              value={height}
              onChange={handleHeightChange}
              className={`w-full bg-brand-background dark:bg-brand-background-dark border p-3 rounded-md focus:outline-none focus:ring-2 ${heightError ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-primary'}`}
              aria-invalid={!!heightError}
              aria-describedby="height-error"
            />
            {heightError && <p id="height-error" className="text-red-500 text-xs mt-1">{heightError}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-brand-subtle/20 text-brand-subtle hover:bg-brand-subtle/30 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={hasErrors}
            className="px-6 py-2 rounded-md bg-brand-primary text-white hover:bg-brand-primary-dark font-semibold transition-colors shadow disabled:bg-brand-subtle disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;