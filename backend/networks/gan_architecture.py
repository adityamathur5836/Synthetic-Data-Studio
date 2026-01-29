import torch.nn as nn

class MedicalGenerator(nn.Module):
    """
    Standard DCGAN-style Generator for medical image synthesis.
    Optimized for grayscale or RGB medical scans (e.g. retinal, X-ray).
    """
    def __init__(self, latent_dim=100, img_channels=3, feature_maps=64):
        super(MedicalGenerator, self).__init__()
        self.main = nn.Sequential(
            # Input is latent_dim vector (Z)
            nn.ConvTranspose2d(latent_dim, feature_maps * 8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(feature_maps * 8),
            nn.ReLU(True),
            # state size: (feature_maps*8) x 4 x 4
            
            nn.ConvTranspose2d(feature_maps * 8, feature_maps * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(feature_maps * 4),
            nn.ReLU(True),
            # state size: (feature_maps*4) x 8 x 8
            
            nn.ConvTranspose2d(feature_maps * 4, feature_maps * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(feature_maps * 2),
            nn.ReLU(True),
            # state size: (feature_maps*2) x 16 x 16
            
            nn.ConvTranspose2d(feature_maps * 2, feature_maps, 4, 2, 1, bias=False),
            nn.BatchNorm2d(feature_maps),
            nn.ReLU(True),
            # state size: (feature_maps) x 32 x 32
            
            nn.ConvTranspose2d(feature_maps, img_channels, 4, 2, 1, bias=False),
            nn.Tanh()
            # final state size: (img_channels) x 64 x 64
        )

    def forward(self, x):
        return self.main(x)
