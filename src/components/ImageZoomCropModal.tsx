import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  PanResponder,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';

interface ImageZoomCropModalProps {
  visible: boolean;
  imageUri: string | null;
  cropShape?: 'circle' | 'square';
  title?: string;
  onApply: (croppedUri: string) => void;
  onCancel: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CROP_BOX_SIZE = Math.min(SCREEN_WIDTH - 60, 320);

export const ImageZoomCropModal: React.FC<ImageZoomCropModalProps> = ({
  visible,
  imageUri,
  cropShape = 'circle',
  title = 'Adjust & Crop Image',
  onApply,
  onCancel,
}) => {
  const [scale, setScale] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const viewShotRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      setScale(1);
      pan.setValue({ x: 0, y: 0 });
      setIsProcessing(false);
    }
  }, [visible, imageUri]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    pan.setValue({ x: 0, y: 0 });
  };

  const handleDone = async () => {
    if (!imageUri) return;
    setIsProcessing(true);
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        setIsProcessing(false);
        onApply(uri);
      } else {
        setIsProcessing(false);
        onApply(imageUri);
      }
    } catch (e) {
      console.log('Error capturing cropped view:', e);
      setIsProcessing(false);
      onApply(imageUri);
    }
  };

  if (!visible || !imageUri) return null;

  const isCircle = cropShape === 'circle';
  const borderRadius = isCircle ? CROP_BOX_SIZE / 2 : 16;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.headerBtn}>
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={handleReset} style={styles.headerBtn}>
            <Icon name="refresh" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.instructions}>
          Drag to reposition • Use +/- or buttons to Zoom In/Out
        </Text>

        {/* Viewport Box */}
        <View style={styles.cropContainer}>
          <View
            style={[
              styles.cropBox,
              {
                width: CROP_BOX_SIZE,
                height: CROP_BOX_SIZE,
                borderRadius: borderRadius,
              },
            ]}
          >
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'jpg', quality: 0.95 }}
              style={{
                width: CROP_BOX_SIZE,
                height: CROP_BOX_SIZE,
                backgroundColor: '#111827',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.imageWrapper,
                  {
                    transform: [
                      { translateX: pan.x },
                      { translateY: pan.y },
                      { scale: scale },
                    ],
                  },
                ]}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: CROP_BOX_SIZE,
                    height: CROP_BOX_SIZE,
                    resizeMode: 'contain',
                  }}
                />
              </Animated.View>
            </ViewShot>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsSection}>
          <View style={styles.zoomControls}>
            <TouchableOpacity onPress={handleZoomOut} style={styles.zoomBtn}>
              <Icon name="remove" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.zoomLevelBadge}>
              <Icon name="search-outline" size={16} color="#9CA3AF" style={{ marginRight: 4 }} />
              <Text style={styles.zoomLevelText}>{scale.toFixed(1)}x</Text>
            </View>

            <TouchableOpacity onPress={handleZoomIn} style={styles.zoomBtn}>
              <Icon name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick presets */}
          <View style={styles.presetRow}>
            {[0.8, 1.0, 1.4, 1.8, 2.2].map(val => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.presetBtn,
                  Math.abs(scale - val) < 0.1 && styles.presetBtnActive,
                ]}
                onPress={() => setScale(val)}
              >
                <Text
                  style={[
                    styles.presetText,
                    Math.abs(scale - val) < 0.1 && styles.presetTextActive,
                  ]}
                >
                  {val.toFixed(1)}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDone}
            style={[styles.applyBtn, isProcessing && { opacity: 0.7 }]}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
            ) : (
              <Icon name="checkmark" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            )}
            <Text style={styles.applyText}>Apply & Fix Size</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'ios' ? 50 : 25,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructions: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 8,
  },
  cropContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  cropBox: {
    borderWidth: 2,
    borderColor: '#E51025',
    backgroundColor: '#000000',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#E51025',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsSection: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  zoomBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E51025',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  zoomLevelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  presetBtnActive: {
    backgroundColor: '#E51025',
  },
  presetText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#E51025',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ImageZoomCropModal;
