const pedirPermissaoCamera = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    alert('Permissão para usar câmera negada!');
    return false;
  }
  return true;
};

const tirarFotoOuVideo = async () => {
  const permitido = await pedirPermissaoCamera();
  if (!permitido) return;

  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setMedia(result.assets[0]);
  }
};
