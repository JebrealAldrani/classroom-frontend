import { useEffect, useRef, useState } from "react";
import { UploadWidgetValue } from "@/types";
import { ImagePlus, UploadCloud } from "lucide-react";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";

type widgetProps = {
  value: any;
  onChange: any;
  disabled?: boolean;
  avatar?: boolean;
};

const UploadWidget = ({
  value = null,
  onChange,
  disabled = false,
  avatar = false,
}: widgetProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  useEffect(() => {
    setPreview(value);
    if (!value) setDeleteToken(null);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "uploads",
          maxFileSize: 5000000,
          clientAllowFormats: ["png", "jpg", "jpeg", "webp"],
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };

            setPreview(payload);
            setDeleteToken(result.info.delete_token ?? null);
            onChangeRef.current?.(payload);
          }
        },
      );

      return true;
    };
    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) window.clearInterval(intervalId);
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div
          className={avatar ? "upload-preview upload-avatar" : "upload-preview"}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Change image"
          aria-disabled={disabled}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openWidget();
            }
          }}
          style={{ backgroundImage: `url(${preview.url})` }}
        >
          <div className="upload-preview-overlay">
            <div className="upload-preview-action flex items-center gap-2 w-fit p-2 rounded-md bg-[rgb(34,197,94)]/70 cursor-pointer mt-3 ml-2 text-white">
              <ImagePlus className="size-4" />
              <span>Change image</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={avatar ? "upload-dropzone upload-avatar" : "upload-dropzone"}
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>click to upload photo</p>
              <p>PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UploadWidget;
