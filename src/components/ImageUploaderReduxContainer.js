import React from 'react';
import { useSelector } from 'react-redux';
import ImageUploaderUnifiedModal from './ImageUploaderUnifiedModal';

const ImageUploaderReduxContainer = ({ visible, onClose, ...props }) => {
  const { currentProfessionalId } = useSelector(state => state.gallery);
  const professionalId = props.professionalId || currentProfessionalId;
  
  // Este componente ahora es simplemente un wrapper que proporciona datos desde Redux
  // al componente principal que maneja todo el flujo internamente
  return (
    <ImageUploaderUnifiedModal 
      visible={visible}
      onClose={onClose}
      onSave={props.onSave}
      professionalId={professionalId}
      title={props.title || "Añadir a tu galería"}
      aspectRatio={props.aspectRatio || [4, 5]}
      purpose={props.purpose || "gallery"}
    />
  );
};

export default ImageUploaderReduxContainer;