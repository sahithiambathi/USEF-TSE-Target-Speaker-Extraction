# Model Checkpoints

The pretrained weights for the **USEF-TFGridNet** model (~179 MB) exceed GitHub's 100 MB file size limit and are not stored directly in this repository.

## Download Instructions

1. Download `usef_tfgridnet_wsj02mix.pth.tar` from the official Hugging Face repository:
   - **Hugging Face Model Card:** [ZBang/USEF-TSE](https://huggingface.co/ZBang/USEF-TSE)
   - **Direct Checkpoint Link:** [USEF-TFGridNet WSJ0-2mix Checkpoint](https://huggingface.co/ZBang/USEF-TSE/resolve/main/chkpt/USEF-TFGridNet/wsj0-2mix/model.pth.tar)

2. Place the downloaded checkpoint file in this directory and ensure it is named:
   ```
   backend/checkpoints/usef_tfgridnet_wsj02mix.pth.tar
   ```

3. When you run `python run_app.py`, the backend will automatically verify and load the model.
