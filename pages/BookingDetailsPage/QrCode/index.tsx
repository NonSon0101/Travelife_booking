    import { useQRCode } from 'next-qrcode';

    function QRCodeGenerator({ url }) {
      const { Image } = useQRCode();

      return (
        <Image
          text={url}
          options={{
            type: 'image/jpeg',
            quality: 1,
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 200,
            color: { dark: '#000', light: '#FFFFFF' },
          }}
        />
      );
    }

    export default QRCodeGenerator;