import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  closeButton: {
    padding: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  userTextInfo: {
    marginLeft: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.7,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  infoPanel: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 15,
    paddingBottom: 30,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  descriptionWrapper: {
    marginBottom: 15,
  },
  photoTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#f0f0f0',
    fontSize: 13,
    lineHeight: 18,
  },
  expandButton: {
    marginTop: 4,
  },
  expandButtonText: {
    color: '#3897f0',
    fontSize: 12,
    fontWeight: '600',
  },
  likesCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  likesAvatarStack: {
    flexDirection: 'row',
    marginRight: 8,
    width: 26,
    height: 16,
  },
  likeAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
  },
  likeAvatar1: {
    zIndex: 2,
  },
  likeAvatar2: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  likeAvatarImage: {
    width: '100%',
    height: '100%',
  },
  likesText: {
    color: '#ddd',
    fontSize: 12,
  },
  actionBarContainer: {
    paddingTop: 10,
    marginTop: 5,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '400',
  },
  imageWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height * 0.7,
  },
  preloadImage: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
  },
  likeIconOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  moreButton: {
    position: 'absolute',
    right: 12,
    top: 10,
    padding: 6,
  },
  headerCenterIndex: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
    alignItems: 'center',
    zIndex: 20,
    justifyContent: 'center',
  },
  centerIndexBubble: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  centerIndexText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
