import React from 'react';
import InstagramStyleImagePicker from './InstagramStyleImagePicker';

/**
 * Componente contenedor compatible con el API existente
 * Reemplaza ImageUploaderReduxContainer con nuestro nuevo componente estilo Instagram
 */
const ImageUploaderReduxContainer = ({ visible, onClose, ...props }) => {
  return (
    <InstagramStyleImagePicker 
      visible={visible}
      onClose={onClose}
      professionalId={props.professionalId}
      onSave={props.onSave}
      title={props.title || "Añadir a tu galería"}
      aspectRatio={props.aspectRatio || [4, 5]}
      purpose={props.purpose || "gallery"}
    />
  );
};

export default ImageUploaderReduxContainer;