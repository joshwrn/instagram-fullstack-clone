const resizeImage = (e, setImageFile, setPostFile, width) => {
  const file = e.target.files[0];
  if (file && file.size < 5000000) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const imgEl = document.createElement('img');
      imgEl.src = event.target.result;

      imgEl.onload = async (img) => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = width;
        const scaleSize = MAX_WIDTH / img.target.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.target.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img.target, 0, 0, canvas.width, canvas.height);

        ctx.canvas.toBlob(
          async (blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            const p = await new Promise((resolve) => {
              reader.onloadend = () => {
                resolve(reader.result);
              };
            });
            // remove beginning of base64 string
            const split = p.split(',');
            setPostFile(split[1]);
            // set preview image
            if (setImageFile !== 'none') {
              const srcEncoded = ctx.canvas.toDataURL(split[1], 'image/jpeg');
              setImageFile(srcEncoded);
            }
          },
          'image/jpeg',
          0.7
        );
      };
    };
  }
};

export default resizeImage;
