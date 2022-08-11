resource "aws_s3_bucket" "gitpod-storage" {
  count = var.enable_external_storage ? 1 : 0

  force_destroy = true
  bucket        = "bucket-${var.cluster_name}"
  acl           = "private"
}

resource "aws_s3_bucket" "gitpod-registry-backend" {
  count = var.enable_external_storage_for_registry_backend ? 1 : 0

  force_destroy = true
  bucket        = "reg-bucket-${var.cluster_name}"
  acl           = "private"
}

resource "aws_s3_bucket_versioning" "storage" {
  count = var.enable_external_storage ? 1 : 0

  bucket = aws_s3_bucket.gitpod-storage[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_versioning" "registry" {
  count = var.enable_external_storage_for_registry_backend ? 1 : 0

  bucket = aws_s3_bucket.gitpod-registry-backend[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

data "aws_iam_policy_document" "s3_policy" {
  count = var.enable_external_storage ? 1 : 0
  statement {
    actions   = ["s3:*"]
    resources = ["*"]
    effect    = "Allow"
  }
}

resource "aws_iam_policy" "policy" {
  count       = var.enable_external_storage ? 1 : 0
  name        = "spolicy-${var.cluster_name}"
  description = "Gitpod ${var.cluster_name} object storage bucket policy"
  policy      = data.aws_iam_policy_document.s3_policy[0].json
}

resource "aws_iam_user" "bucket_storage" {
  count = var.enable_external_storage ? 1 : 0
  name  = "suser-${var.cluster_name}"

}

resource "aws_iam_user_policy_attachment" "attachment" {
  count      = var.enable_external_storage ? 1 : 0
  user       = aws_iam_user.bucket_storage[0].name
  policy_arn = aws_iam_policy.policy[0].arn
}

resource "aws_iam_access_key" "bucket_storage_user" {
  count = var.enable_external_storage ? 1 : 0
  user  = aws_iam_user.bucket_storage[0].name
}
